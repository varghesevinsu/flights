import { AmericanFlightsBase} from '@baseapp/american-flights/american-flights/american-flights.base.model';

export class AmericanFlightsApiConstants {
    public static readonly getById: any = {
        url: '/rest/americanflights/{sid}',
        method: 'GET',
        showloading: true
    };
    public static readonly create: any = {
        url: '/rest/americanflights/',
        method: 'POST',
        showloading: true
    };
    public static readonly delete: any = {
        url: '/rest/americanflights/{ids}',
        method: 'DELETE',
        showloading: true
    };
    public static readonly getDatatableData: any = {
        url: '/rest/americanflights/datatable',
        method: 'POST',
        showloading: true
    };
    public static readonly update: any = {
        url: '/rest/americanflights/',
        method: 'PUT',
        showloading: true
    };
    public static readonly autoSuggestService: any = {
        url: '/rest/americanflights/autosuggest',
        method: 'GET',
        showloading: false
    };
}