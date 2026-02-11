export type BlockValue = string | number | boolean | null | object | Block[];

export default interface Block {
    type: string;
    value: BlockValue;
    config?: object;
}
