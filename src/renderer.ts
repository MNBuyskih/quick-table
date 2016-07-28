module TableRender {
    export interface IColumns {
        key:string;
        label:string;
        className:string;
        render(renderer:Renderer):string;
    }
    export enum ISortingDirections{
        DESC,
        ASC
    }

    export interface ISorting {
        column:IColumns;
        direction:ISortingDirections;
        setSorting(column:IColumns, direction:ISortingDirections):void;
        is(column:IColumns):boolean;
    }

    export interface ISortingDefault {
        column:string,
        direction:ISortingDirections;
    }

    export interface IConfig {
        columns:IColumns[];
        sortingDefault:ISortingDefault;
        sorting(data:IRowData[], sorting:ISorting):void;
        tableClassName:string;
        headersClassName:string;
        beforeRender(renderer:Renderer):void;
        afterRender(renderer:Renderer, html:string):string;

        beforeRowRender(renderer:Renderer, row:IRowData):void;
        afterRowRender(renderer:Renderer, html:string):string;
    }

    export interface IRowData {
        values:ICellMap;
        className:string;
        cache:ICache<string>;
        render(renderer:Renderer):string;
    }

    export interface ICellData {
        value:string;
        className:string;
        cache:ICache<string>;
        render():string;
    }

    export interface ICache<T> {
        reset:() => void;
        setValue:(value:T) => void;
        getValue:() => T;
        isEmpty:() => boolean;
    }

    export interface ICellMap {
        [index:string]:ICellData
    }

    export interface IRowRenderOutput {
        [index:string]:string;
    }

    export class Sorting implements ISorting {
        direction:ISortingDirections;
        column:IColumns;

        setSorting(column:IColumns, direction:ISortingDirections = ISortingDirections.ASC):void {
            if (column === this.column) {
                if (this.direction == ISortingDirections.ASC)
                    this.direction = ISortingDirections.DESC;
                else {
                    this.direction = ISortingDirections.ASC;
                }
            } else {
                this.column = column;
                this.direction = ISortingDirections.ASC;
            }

            if (direction !== undefined) this.direction = direction;
        }

        is(column:IColumns):boolean {
            return this.column === column;
        }
    }

    export class RowData implements IRowData {
        values:ICellMap = {};
        className:string;
        cache:ICache<string> = new Cache<string>();

        constructor(row:IRowData) {
            this.values = Object.keys(row.values).reduce((values, key) => {
                values[key] = new CellData(row.values[key]);
                return values;
            }, <ICellMap>{});
            this.className = row.className;
        }

        render(renderer:Renderer):string {
            if (renderer.config.beforeRowRender) {
                renderer.config.beforeRowRender(renderer, this);
            }
            if (this.cache.isEmpty()) {
                let out = Object.keys(this.values)
                    .reduce((out, key) => {
                        out[key] = this.values[key].render();
                        return out;
                    }, <IRowRenderOutput>{});

                let rowOut = renderer.config.columns.map((column) => {
                    let cell = out[column.key];
                    if (cell) return cell;
                }).join('');

                if (rowOut) {
                    rowOut = addClassName('<tr>', this.className) + `${rowOut}</tr>`;
                }

                if (renderer.config.afterRowRender) {
                    rowOut = renderer.config.afterRowRender(renderer, rowOut);
                }

                this.cache.setValue(rowOut);
            }

            return this.cache.getValue();
        }
    }

    class CellData implements ICellData {
        value:string;
        className:string;
        cache:ICache<string> = new Cache<string>();

        constructor(cell:ICellData) {
            this.value = cell.value;
            this.className = cell.className;
        }

        render():string {
            if (this.cache.isEmpty()) {
                let html = addClassName('<td>', this.className) + `${this.value}</td>`;
                this.cache.setValue(html);
            }
            return this.cache.getValue();
        }
    }

    class Cache<T> implements ICache<T> {
        private _value:T;

        setValue(value:T) {
            this._value = value;
        }

        getValue() {
            return this._value;
        }

        isEmpty() {
            return !this._value;
        }

        reset() {
            this._value = null;
        }
    }

    export class Config implements IConfig {
        columns:IColumns[];
        tableClassName:string;
        headersClassName:string;
        sortingDefault:ISortingDefault;

        sorting(data:IRowData[], sorting:ISorting):void {
        }

        beforeRender(renderer:Renderer):void {
        }

        afterRender(renderer:Renderer, html:string):string {
            return null;
        }

        beforeRowRender(renderer:Renderer, row:IRowData):void {
        }

        afterRowRender(renderer:Renderer, html:string):string {
            return null;
        }

        constructor(config:IConfig) {
            this.columns = config.columns.map((column) => new Column(column));
            this.tableClassName = config.tableClassName;
            this.headersClassName = config.headersClassName;
            this.beforeRender = config.beforeRender;
            this.afterRender = config.afterRender;
            this.beforeRowRender = config.beforeRowRender;
            this.afterRowRender = config.afterRowRender;
            this.sorting = config.sorting;
            this.sortingDefault = config.sortingDefault;
        }
    }

    export class Column implements IColumns {
        key:string;
        label:string;
        className:string = '';
        private _classNameBackup:string;

        constructor(column:IColumns) {
            this.key = column.key;
            this.label = column.label;
            this.className = column.className;
        }

        render(renderer:Renderer):string {
            if (this._classNameBackup === undefined) this._classNameBackup = this.className || '';
            this.className = this._classNameBackup;

            if (renderer.config.sorting) {
                !this.className ? this.className = '' : this.className += ' ';
                this.className += 'quick-table-sorting';
                if (renderer.sorting.is(this)) {
                    this.className += ' quick-table-sorting-' + (renderer.sorting.direction === ISortingDirections.ASC ? 'asc' : 'desc');
                }
            }
            return addClassName('<th>', this.className) + this.label + '</th>';
        }
    }

    export class Renderer {
        data:IRowData[];
        config:IConfig;

        sorting:ISorting = new Sorting();

        constructor(data:IRowData[], config:IConfig) {
            this.data = data.map((row) => new RowData(row));
            this.config = new Config(config);

            if (this.config.sortingDefault) {
                this.config.columns.forEach((column) => {
                    if (column.key == this.config.sortingDefault.column)
                        this.sorting.column = column;
                });
                this.sorting.direction = this.config.sortingDefault.direction;
            }
        }

        render():string {
            if (this.config.beforeRender) {
                this.config.beforeRender(this);
            }
            let html = this.renderTable()
                + this.renderHeader()
                + this.renderData()
                + '</table>';

            if (this.config.afterRender) {
                html = this.config.afterRender(this, html);
            }

            return html;
        }

        sort():void {
            if (this.config.sorting) this.config.sorting(this.data, this.sorting);
        }

        private renderTable():string {
            return addClassName('<table>', this.config.tableClassName);
        }

        private renderHeader():string {
            let html = this.config.columns.reduce((html, column) => {
                html += column.render(this);
                return html;
            }, '');
            if (html) {
                html = addClassName('<tr>', this.config.headersClassName) + `${html}</tr>`;
            }
            return html;
        }

        private renderData():string {
            return this.data.map(row => row.render(this)).join('');
        }

        resetCache():void {
            this.data.forEach((data) => {
                data.cache.reset();
                Object.keys(data.values).forEach((key) => data.values[key].cache.reset());
            });
        }
    }

    function addClassName(tag:string, className:string):string {
        let attr = '';
        if (className) attr += ` class="${className}"`;
        return tag.replace('>', attr + '>');
    }
}
