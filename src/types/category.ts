export type CategoryData = {
  id: any;
  categoryName: string;
  creationDate: any;
  lastModifiedDate: any;
  subCategories?: any[];
};

export type SubCategoryData = {
  id: any;
  subcategoryName: string;
  creationDate: any;
  lastModifiedDate: any;
  category: CategoryData;
};
