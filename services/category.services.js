import categoryModel from "../models/category.model.js";

//create category
export const createCategory = async ({
  image,
  categoryName,
  categoryDescription,
  colorCode,
}) => {
  const category = new categoryModel();
  await category.save({
    image: image,
    categoryName: categoryName,
    categoryDescription: categoryDescription,
    colorCode: colorCode,
  });

  return { success: true, message: "Category created succesfully" };
};

//getall categories
export const getAllCategories = async () => {
  const categories = categoryModel.find();
  if (categories) {
    return {
      data: categories,
    };
  } else {
    return { success: false, status: 404, message: "No category available" };
  }
};

//get category by id
export const getCategoryById = async (id) => {
  const category = categoryModel.findById({ _id: id });
  if (category) {
    return {
      data: category,
    };
  } else {
    return { success: false, status: 404, message: "Category unavailable" };
  }
};

//update category
export const 

//delete category
// export const deleteCategory = async (id) => {
//   const category = await categoryModel.deleteOne({ _id: id });
//   if (category) {
//     return {
//       success: true,
//       status: 200,
//       message: "Category deleted",
//     };
//   } else {
//     return { success: false, status: 404, message: "Category unavailable" };
//   }
// };
