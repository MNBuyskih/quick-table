var TableRender;
(function (TableRender) {
    var Adapters;
    (function (Adapters) {
        $.fn.QuickTable = function (data, config) {
            var $this = $(this);
            var renderer = new TableRender.Renderer(data, config);
            renderer.config.afterRender = function (renderer, html) {
                $this.html(html);
                $.each($this.find('.quick-table-sorting'), function (n, el) {
                    $(el).on('click', function () {
                        renderer.sorting.setSorting(renderer.config.columns[n]);
                        renderer.render();
                    }, false);
                });
                return html;
            };
            renderer.render();
            return renderer;
        };
    })(Adapters = TableRender.Adapters || (TableRender.Adapters = {}));
})(TableRender || (TableRender = {}));
//# sourceMappingURL=jquery.js.map