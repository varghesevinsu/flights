export interface AmericanFlightsBase {
	id: number;
	sid: string;
	price: number;
	code: string;
	createdDate: Date;
	origin: string;
	emptyseats: number;
	modifiedDate: Date;
	plane: any;
	createdBy: string;
	departuredate: Date;
	destination: string;
	modifiedBy: string;
}