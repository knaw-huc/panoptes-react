import {useScreenState} from "hooks/index";
import {ElementDefinition} from "../schema";

export default function useElementState(element: ElementDefinition) {
    const { getValue } = useScreenState();

    return {
        value: getValue(element.value),
        hidden: element.hidden ?? false,
        label: element.label,
        infoLabel: element.infoLabel,
    };
}
