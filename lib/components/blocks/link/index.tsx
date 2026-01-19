import {Block} from "components/blocks/BlockLoader.tsx";
import classes from "components/blocks/json/JsonBlockRenderer.module.css";
import {useRouter} from "@tanstack/react-router";

export interface LinkBlock extends Block {
    type: 'link';
    url: string;
    model?: Record<string, unknown>;
}

export default function RenderLink({block}: { block: LinkBlock }) {

    const router = useRouter();
    const { value, url, model } = block;

    if (!value || !url) {
        return <span className={classes.empty}>—</span>;
    }

    const link = router.buildLocation({to: url, params: model }).href

    return (
        <a className={classes.link} href={link}>
            {typeof value === "string" ? value : String(value)}
        </a>
    );

}


