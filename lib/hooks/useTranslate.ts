import {useTranslation} from "react-i18next";

export default function useTranslate() {
    const { t } = useTranslation();

    return t;
}
