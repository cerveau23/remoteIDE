export namespace Geography{
    /**
     * Represents a location on the net.
     * @property {Hostname} ServerName - The location's name.
     * @property {Number} ServerID - The location's UID.
     * @property {Path} Path - The path to the location.
     * @property {Boolean} HasChildren - Whether the location has children locations.
     * @property {Boolean} [Backdoored] - Whether the server has been backdoored in the past.
     */
    export type Location = [
        /** Server Name */
        ServerName: Hostname, // Test
        /** Server ID */
        ServerID: number,
        /** PathPoints to the Server via IDs */
        Path: Path,
        /** Whether the server has "children" */
        HasChildren: boolean,
        /** whether the server has been backdoored in the past */
        Backdoored?: boolean
    ]
    export type Hostname = string;
    /** An array of {@link Location locations}.*/
    export type Map = Location[];

    /**
     * The path to a {@link ``Location``}, represented as an array of ``UIDs`` from ``Home`` to the ``Location``
     */
    export interface Path extends Array<number> {
    }
}