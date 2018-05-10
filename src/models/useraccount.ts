
export class UserAccount {
    constructor(public code: string,
        public fname: string,
        public lname: string,
        public unitcode: string,
        public unitname: string,
        public poscode: string,
        public posname: string,
        public email: string,
        public ismale: boolean,
        public issalemanager: boolean,
        public photo: string) { }
}