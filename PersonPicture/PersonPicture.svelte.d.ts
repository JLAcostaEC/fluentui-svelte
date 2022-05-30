import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        size?: number;
        src?: string;
        alt?: string;
        class?: string;
        element?: HTMLImageElement | HTMLDivElement;
        containerElement?: HTMLDivElement;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
        badge: {};
    };
};
export declare type PersonPictureProps = typeof __propDef.props;
export declare type PersonPictureEvents = typeof __propDef.events;
export declare type PersonPictureSlots = typeof __propDef.slots;
export default class PersonPicture extends SvelteComponentTyped<PersonPictureProps, PersonPictureEvents, PersonPictureSlots> {
}
export {};
