import { sqliteTable, integer, text, primaryKey, unique, index, foreignKey } from "drizzle-orm/sqlite-core";
// Définition des tables
interface Quantity {
   value: number;
   unit: string;
}
interface NutrientAmountType {
   nutrientId: string;
   nutrientValue: number;
   originalValue?: string;
}
interface IngredientType {
   name: string;
   quantity: Quantity;
   foodId: string | number;
}
interface PreparationStepType {
   stepNumber: number;
   description: string;
   estimatedTime?: number;
}
// Table food_groups
export const foodGroups = sqliteTable("food_groups", {
   groupId: text("groupId").primaryKey(),
   groupCode: text("groupCode", { length: 15 }),
   groupName: text("groupName", { length: 255 }),
   groupNameF: text("groupNameF", { length: 255 }),
});

// Table food_names
export const foodNames = sqliteTable(
   "food_names",
   {
      foodId: text("foodId").primaryKey(),
      foodCode: text("foodCode", { length: 10 }),
      groupId: text("groupId")
         .notNull()
         .references(() => foodGroups.groupId),
      foodName: text("foodName", { length: 255 }),
      foodNameF: text("foodNameF", { length: 255 }),
      scientificName: text("scientificName", { length: 155 }),
      foodSource: text("foodSource", { length: 255 }),
      foodOrigin: text("foodOrigin", { length: 100 }),
      foodNutrients: text("foodNutrients", { mode: "json" }).$type<NutrientAmountType[]>(),
   },
   (table) => ({
      foodCodeIndex: index("foodCodeIndex").on(table.foodCode),
      groupIdIndex: index("groupIdIndex").on(table.groupId),
      foodNameIndex: index("foodNameIndex").on(table.foodName),
      foodNameFIndex: index("foodNameFIndex").on(table.foodNameF),
      foodIdIndex: index("foodIdIndex").on(table.foodId),
   }),
);

// Table nutrient_names
export const nutrientNames = sqliteTable(
   "nutrient_names",
   {
      nutrientId: text("nutrientId").primaryKey(),
      nutrientCode: text("nutrientCode", { length: 10 }),
      nutrientName: text("nutrientName", { length: 255 }),
      nutrientNameF: text("nutrientNameF", { length: 255 }),
      nutrientUnit: text("nutrientUnit", { length: 5 }),
      nutrientSymbol: text("nutrientSymbol", { length: 10 }),
      tagname: text("tagname", { length: 20 }),
      nutrientDecimal: text("nutrientDecimal", { length: 15 }),
   },
   (table) => ({
      nutrientIdIndex: index("nutrientIdIndex").on(table.nutrientId),
      tagnameIndex: index("tagnameIndex").on(table.tagname),
   }),
);

// Table meals_types
export const mealsTypes = sqliteTable("meals_types", {
   typeId: text("typeId").primaryKey(),
   name: text("name"),
   nameF: text("nameF"),
});

// Table meals_categories
export const mealsCategories = sqliteTable("meals_categories", {
   categoryId: text("categoryId").primaryKey(),
   name: text("name", { length: 200 }),
   nameF: text("nameF", { length: 200 }),
});

// Table recipes
export const recipes = sqliteTable("recipes", {
   recipeId: text("recipeId").primaryKey(),
   name: text("name", { length: 255 }),
   nameF: text("nameF", { length: 255 }),
   categoryId: text("categoryId")
      .notNull()
      .references(() => mealsCategories.categoryId),
   typeId: text("typeId")
      .notNull()
      .references(() => mealsTypes.typeId),
   ingredients: text("ingredients", { mode: "json" }).$type<IngredientType[]>(),
   preparationMethod: text("preparationMethod", { mode: "json" }).$type<PreparationStepType[]>(),
   cookingTime: integer("cookingTime"),
   quantity: text("quantity", { mode: "json" }).$type<Quantity>(),
   description: text("description"),
});
