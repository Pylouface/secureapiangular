import { MESSAGE } from "./message";

export interface RETOUR {
    //_JSON_REPONSE et de type any car le type de retour dépend de l'url demandé
    _JSON_REPONSE: any;
    _CODE_REPONSE: number;
    _VALIDE: boolean;
    _MESSAGES: MESSAGE[];
    _JWT: string;
}