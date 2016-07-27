var TableRender;
(function (TableRender) {
    var RowData = (function () {
        function RowData(row) {
            this.values = {};
            this.cache = new Cache();
            this.values = Object.keys(row.values).reduce(function (values, key) {
                values[key] = new CellData(row.values[key]);
                return values;
            }, {});
            this.className = row.className;
        }
        RowData.prototype.render = function (columns) {
            var _this = this;
            var out = Object.keys(this.values)
                .reduce(function (out, key) {
                out[key] = _this.values[key].render();
                return out;
            }, {});
            var rowOut = columns.map(function (column) {
                var cell = out[column.key];
                if (cell)
                    return cell;
            }).join('');
            if (rowOut) {
                rowOut = addClassName('<tr>', this.className) + (rowOut + "</tr>");
            }
            return rowOut;
        };
        return RowData;
    }());
    var CellData = (function () {
        function CellData(cell) {
            this.cache = new Cache();
            this.value = cell.value;
            this.className = cell.className;
        }
        CellData.prototype.render = function () {
            return addClassName('<td>', this.className) + (this.value + "</td>");
        };
        return CellData;
    }());
    var Cache = (function () {
        function Cache() {
        }
        Cache.prototype.reset = function () {
            this.value = '';
        };
        return Cache;
    }());
    var Config = (function () {
        function Config(config) {
            this.columns = config.columns.map(function (column) { return new Column(column); });
            this.tableClassName = config.tableClassName;
            this.headersClassName = config.headersClassName;
        }
        return Config;
    }());
    TableRender.Config = Config;
    var Column = (function () {
        function Column(column) {
            this.className = '';
            this.key = column.key;
            this.label = column.label;
            this.className = column.className;
        }
        Column.prototype.renderHeader = function () {
            return addClassName('<th>', this.className) + this.label + '</th>';
        };
        return Column;
    }());
    TableRender.Column = Column;
    var Renderer = (function () {
        function Renderer(data, config) {
            this.data = data.map(function (row) { return new RowData(row); });
            this.config = new Config(config);
        }
        Renderer.prototype.render = function () {
            return this.renderTable()
                + this.renderHeader()
                + this.renderData()
                + '</table>';
        };
        Renderer.prototype.renderTable = function () {
            return addClassName('<table>', this.config.tableClassName);
        };
        Renderer.prototype.renderHeader = function () {
            var html = this.config.columns.reduce(function (html, column) {
                html += column.renderHeader();
                return html;
            }, '');
            if (html) {
                html = addClassName('<tr>', this.config.headersClassName) + (html + "</tr>");
            }
            return html;
        };
        Renderer.prototype.renderData = function () {
            var _this = this;
            return this.data.map(function (row) { return row.render(_this.config.columns); }).join('');
        };
        return Renderer;
    }());
    TableRender.Renderer = Renderer;
    function addClassName(tag, className) {
        var attr = '';
        if (className)
            attr += " class=\"" + className + "\"";
        return tag.replace('>', attr + '>');
    }
})(TableRender || (TableRender = {}));
//# sourceMappingURL=index.js.map