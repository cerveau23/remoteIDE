export interface PortData<T> {
    kind: "PortData";
    name: string,
    data: T,
    loop: boolean
}