module TableRender.Adapters {
    export function VanillaAdapter(element:HTMLElement, data:IRowData[], config:IConfig) {
        let renderer = new Renderer(data, config);
        renderer.config.afterRender = (renderer, html) => {
            element.innerHTML = html;
            let nodes = element.querySelectorAll('.quick-table-sorting');
            for (let i = 0; i < nodes.length; i++) {
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
}