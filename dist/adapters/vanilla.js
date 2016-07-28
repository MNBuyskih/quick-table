var TableRender;
(function (TableRender) {
    var Adapters;
    (function (Adapters) {
        function VanillaAdapter(element, data, config) {
            var renderer = new TableRender.Renderer(data, config);
            renderer.config.afterRender = function (renderer, html) {
                element.innerHTML = html;
                var nodes = element.querySelectorAll('.quick-table-sorting');
                for (var i = 0; i < nodes.length; i++) {
                    (function (n) {
                        nodes[n].addEventListener('click', function (e) {
                            renderer.sorting.setSorting(renderer.config.columns[n]);
                            renderer.render();
                        }, false);
                    })(i);
                }
                return html;
            };
            renderer.render();
            return renderer;
        }
        Adapters.VanillaAdapter = VanillaAdapter;
    })(Adapters = TableRender.Adapters || (TableRender.Adapters = {}));
})(TableRender || (TableRender = {}));
//# sourceMappingURL=vanilla.js.map