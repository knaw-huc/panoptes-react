import {describe, it} from 'vitest';
import NavigationBar from "components/utils/NavigationBar.tsx";
import {render} from "@testing-library/react";

describe('NavigationBar', () => {
    it('renders', () => {
        render(<NavigationBar />);
    })
})