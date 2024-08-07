export type NewValueChain = {
  name: string;
  valueChainType: string;
};

export type ValueChain = {
  id: any;
  valueChainName: string;
  valueChainType: string;
  creationDate?: string;

  season: string;
  intendedUseOfHarvest: string;
  areaInAcres: number;
  anticipatedHarvestDate: string;
};
