declare module 'sozlukjs' {
    export interface MeaningData {
        madde_id:        string;
        kac:             string;
        kelime_no:       string;
        cesit:           string;
        anlam_gor:       string;
        on_taki:         null;
        madde:           string;
        cesit_say:       string;
        anlam_say:       string;
        taki:            null;
        cogul_mu:        string;
        ozel_mi:         string;
        lisan_kodu:      string;
        lisan:           string;
        telaffuz:        null;
        birlesikler:     string;
        font:            null;
        madde_duz:       string;
        gosterim_tarihi: null;
        anlamlarListe:   AnlamlarListe[];
        error?:string
    }
    
    export interface AnlamlarListe {
        anlam_id:        string;
        madde_id:        string;
        anlam_sira:      string;
        fiil:            string;
        tipkes:          string;
        anlam:           string;
        gos:             string;
        orneklerListe:   OrneklerListe[];
        ozelliklerListe: OzelliklerListe[];
    }
    
    export interface OrneklerListe {
        ornek_id:   string;
        anlam_id:   string;
        ornek_sira: string;
        ornek:      string;
        kac:        string;
        yazar_id:   string;
        yazar:      Yazar[];
    }
    
    export interface Yazar {
        yazar_id: string;
        tam_adi:  string;
        kisa_adi: string;
        ekno:     string;
    }
    
    export interface OzelliklerListe {
        ozellik_id: string;
        tur:        string;
        tam_adi:    string;
        kisa_adi:   string;
        ekno:       string;
    }
    export class TDKDictionary  {
        static async getMeaningData(query:string):Promise<MeaningData[]>
    }
}