import { rollup } from "rollup";
import { string } from "rollup-plugin-string";

rollup({
    entry: "./src/**/*.",
    plugins: [
        string({
            include: [
                '**/*.frag',
                '**/*.vert',
            ],
        })
    ]
});