var TableRender;
(function (TableRender) {
    (function (ISortingDirections) {
        ISortingDirections[ISortingDirections["DESC"] = 0] = "DESC";
        ISortingDirections[ISortingDirections["ASC"] = 1] = "ASC";
    })(TableRender.ISortingDirections || (TableRender.ISortingDirections = {}));
    var ISortingDirections = TableRender.ISortingDirections;
    var Sorting = (function () {
        function Sorting() {
        }
        Sorting.prototype.setSorting = function (column, direction) {
            if (direction === void 0) { direction = ISortingDirections.ASC; }
            if (column === this.column) {
                if (this.direction == ISortingDirections.ASC)
                    this.direction = ISortingDirections.DESC;
                else {
                    this.direction = ISortingDirections.ASC;
                }
            }
            else {
                this.column = column;
                this.direction = ISortingDirections.ASC;
            }
            if (direction !== undefined)
                this.direction = direction;
        };
        Sorting.prototype.is = function (column) {
            return this.column === column;
        };
        return Sorting;
    }());
    TableRender.Sorting = Sorting;
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
            this.sorting = config.sorting;
            this.sortingDefault = config.sortingDefault;
        }
        Config.prototype.sorting = function (data, sorting) {
        };
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
        Column.prototype.render = function (renderer) {
            if (this._classNameBackup === undefined)
                this._classNameBackup = this.className || '';
            this.className = this._classNameBackup;
            if (renderer.config.sorting) {
                !this.className ? this.className = '' : this.className += ' ';
                this.className += 'quick-table-sorting';
                if (renderer.sorting.is(this)) {
                    this.className += ' quick-table-sorting-' + (renderer.sorting.direction === ISortingDirections.ASC ? 'asc' : 'desc');
                }
            }
            return addClassName('<th>', this.className) + this.label + '</th>';
        };
        return Column;
    }());
    TableRender.Column = Column;
    var Renderer = (function () {
        function Renderer(data, config) {
            var _this = this;
            this.sorting = new Sorting();
            this.data = data.map(function (row) { return new RowData(row); });
            this.config = new Config(config);
            if (this.config.sortingDefault) {
                this.config.columns.forEach(function (column) {
                    if (column.key == _this.config.sortingDefault.column)
                        _this.sorting.column = column;
                });
                this.sorting.direction = this.config.sortingDefault.direction;
            }
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
        Renderer.prototype.sort = function () {
            if (this.config.sorting)
                this.config.sorting(this.data, this.sorting);
        };
        Renderer.prototype.renderTable = function () {
            return addClassName('<table>', this.config.tableClassName);
        };
        Renderer.prototype.renderHeader = function () {
            var _this = this;
            var html = this.config.columns.reduce(function (html, column) {
                html += column.render(_this);
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