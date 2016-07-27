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
        RowData.prototype.render = function (renderer) {
            var _this = this;
            if (renderer.config.beforeRowRender) {
                renderer.config.beforeRowRender(renderer, this);
            }
            if (this.cache.isEmpty()) {
                var out_1 = Object.keys(this.values)
                    .reduce(function (out, key) {
                    out[key] = _this.values[key].render();
                    return out;
                }, {});
                var rowOut = renderer.config.columns.map(function (column) {
                    var cell = out_1[column.key];
                    if (cell)
                        return cell;
                }).join('');
                if (rowOut) {
                    rowOut = addClassName('<tr>', this.className) + (rowOut + "</tr>");
                }
                if (renderer.config.afterRowRender) {
                    rowOut = renderer.config.afterRowRender(renderer, rowOut);
                }
                this.cache.setValue(rowOut);
            }
            return this.cache.getValue();
        };
        return RowData;
    }());
    TableRender.RowData = RowData;
    var CellData = (function () {
        function CellData(cell) {
            this.cache = new Cache();
            this.value = cell.value;
            this.className = cell.className;
        }
        CellData.prototype.render = function () {
            if (this.cache.isEmpty()) {
                var html = addClassName('<td>', this.className) + (this.value + "</td>");
                this.cache.setValue(html);
            }
            return this.cache.getValue();
        };
        return CellData;
    }());
    var Cache = (function () {
        function Cache() {
        }
        Cache.prototype.setValue = function (value) {
            this._value = value;
        };
        Cache.prototype.getValue = function () {
            return this._value;
        };
        Cache.prototype.isEmpty = function () {
            return !this._value;
        };
        Cache.prototype.reset = function () {
            this._value = null;
        };
        return Cache;
    }());
    var Config = (function () {
        function Config(config) {
            this.columns = config.columns.map(function (column) { return new Column(column); });
            this.tableClassName = config.tableClassName;
            this.headersClassName = config.headersClassName;
            this.beforeRender = config.beforeRender;
            this.afterRender = config.afterRender;
            this.beforeRowRender = config.beforeRowRender;
            this.afterRowRender = config.afterRowRender;
        }
        Config.prototype.beforeRender = function (renderer) {
        };
        Config.prototype.afterRender = function (renderer, html) {
            return null;
        };
        Config.prototype.beforeRowRender = function (renderer, row) {
        };
        Config.prototype.afterRowRender = function (renderer, html) {
            return null;
        };
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
            if (this.config.beforeRender) {
                this.config.beforeRender(this);
            }
            var html = this.renderTable()
                + this.renderHeader()
                + this.renderData()
                + '</table>';
            if (this.config.afterRender) {
                html = this.config.afterRender(this, html);
            }
            return html;
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
            return this.data.map(function (row) { return row.render(_this); }).join('');
        };
        Renderer.prototype.resetCache = function () {
            this.data.forEach(function (data) {
                data.cache.reset();
                Object.keys(data.values).forEach(function (key) { return data.values[key].cache.reset(); });
            });
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