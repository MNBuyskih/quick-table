module TableRender {
    export interface IColumns {
        key:string;
        label:string;
        className:string;
        renderHeader():string;
    }

    export interface IConfig {
        columns:IColumns[];
        tableClassName:string;
        headersClassName:string;
    }

    export interface IRowData {
        values:ICellMap;
        className:string;
        cache:ICache;
        render(columns:IColumns[]):string;
    }

    export interface ICellData {
        value:string;
        className:string;
        cache:ICache;
        render():string;
    }

    export interface ICache {
        value:string;
        reset:() => void;
    }

    export interface ICellMap {
        [index:string]:ICellData
    }

    export interface IRowRenderOutput {
        [index:string]:string;
    }

    class RowData implements IRowData {
        values:ICellMap = {};
        className:string;
        cache:ICache = new Cache();

        constructor(row:IRowData) {
            this.values = Object.keys(row.values).reduce((values, key) => {
                values[key] = new CellData(row.values[key]);
                return values;
            }, <ICellMap>{});
            this.className = row.className;
        }

        render(columns:IColumns[]):string {
            let out = Object.keys(this.values)
                .reduce((out, key) => {
                    out[key] = this.values[key].render();
                    return out;
                }, <IRowRenderOutput>{});

            let rowOut = columns.map((column) => {
                let cell = out[column.key];
                if (cell) return cell;
            }).join('');

            if (rowOut) {
                rowOut = addClassName('<tr>', this.className) + `${rowOut}</tr>`;
            }

            return rowOut;
        }
    }

    class CellData implements ICellData {
        value:string;
        className:string;
        cache:ICache = new Cache();

        constructor(cell:ICellData) {
            this.value = cell.value;
            this.className = cell.className;
        }

        render():string {
            return addClassName('<td>', this.className) + `${this.value}</td>`;
        }
    }

    class Cache implements ICache {
        value:string;

        reset() {
            this.value = '';
        }
    }

    export class Config implements IConfig {
        columns:IColumns[];
        tableClassName:string;
        headersClassName:string;

        constructor(config:IConfig) {
            this.columns = config.columns.map((column) => new Column(column));
            this.tableClassName = config.tableClassName;
            this.headersClassName = config.headersClassName;
        }
    }

    export class Column implements IColumns {
        key:string;
        label:string;
        className:string = '';

        constructor(column:IColumns) {
            this.key = column.key;
            this.label = column.label;
            this.className = column.className;
        }

        renderHeader():string {
            return addClassName('<th>', this.className) + this.label + '</th>';
        }
    }

    export class Renderer {
        data:IRowData[];
        config:IConfig;

        constructor(data:IRowData[], config:IConfig) {
            this.data = data.map((row) => new RowData(row));
            this.config = new Config(config);
        }

        render():string {
            return this.renderTable()
                + this.renderHeader()
                + this.renderData()
                + '</table>';
        }

        private renderTable():string {
            return addClassName('<table>', this.config.tableClassName);
        }

        private renderHeader():string {
            let html = this.config.columns.reduce((html, column) => {
                html += column.renderHeader();
                return html;
            }, '');
            if (html) {
                html = addClassName('<tr>', this.config.headersClassName) + `${html}</tr>`;
            }
            return html;
        }

        private renderData():string {
            return this.data.map(row => row.render(this.config.columns)).join('');
        }
    }

    function addClassName(tag:string, className:string):string {
        let attr = '';
        if (className) attr += ` class="${className}"`;
        return tag.replace('>', attr + '>');
    }
}
