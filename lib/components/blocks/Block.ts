export type BlockValue = string | object | Block[];

export default interface Block {
    type: string;
    value: BlockValue;
    config?: object;
}
