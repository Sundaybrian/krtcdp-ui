export type ICooperative = {
  id: any;
  groupName: string;
  mobilePhone: string;
  yearOfCreation: number;
  residence: string;
  county: string;
  subCounty: string;
  insuranceProvider: string;
  incorporationNumber: string;
  krapin: string;
  enterpriseCovered: string;
  insuranceType: string;
};

export type CreateCooperative = {
  groupName: string;
  mobilePhone: string;
  yearOfCreation: any;
  residence: string;
  county: string;
  subCounty: string;
  insuranceProvider: string;
  incorporationNumber: string;
  krapin: string;
  enterpriseCovered: string;
  insuranceType: string;
  hasInsurance: boolean;
};
