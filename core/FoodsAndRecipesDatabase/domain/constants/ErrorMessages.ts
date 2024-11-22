export const INVALID_FOOD_CODE_ERROR = "Code alimentaire invalide. Veuillez fournir un code valide.";
export const INVALID_FOOD_NAME_ERROR = "Nom alimentaire invalide. Veuillez fournir un nom valide.";
export const INVALID_FOOD_ORIGIN_ERROR = "Origine alimentaire invalide. Veuillez fournir une origine valide.";
export const INVALID_FOOD_GROUP_CODE_ERROR = "Code de groupe alimentaire invalide. Veuillez fournir un code valide.";
export const EMPTY_FOOD_GROUP_NAME_ERROR = "Nom du groupe alimentaire ne doit pas être vide. Veuillez ajouter un nom valide.";
export const INVALID_NUTRIENT_VALUE_ERROR = "Valeur du nutriment invalide. La valeur doit être supérieure ou égale à zéro.";
export const INVALID_NUTRIENT_DECIMALS_ERROR = "Nombre de decimals invalide. Le nombre de decimals  doit être supérieure ou égale à zéro.";
export const INVALID_NUTRIENT_TAGNAME_ERROR = "INFOODS TagName invalide. Veuillez définir un code INFOODS valide pour le nutriment.";
export const INVALID_NUTRIENT_CODE_ERROR = "Code de nutriment invalide. Veuillez définir un code valide pour le nutriment.";
export const EMPTY_NUTRIENT_NAME_ERROR = "Nom du nutriment ne doit pas être vide. Veuillez ajouter un nom de nutriment valide.";
export const INVALID_NUTRIENT_UNIT_ERROR = "Unité de nutriment invalide. Veuillez définir une unité valide pour le nutriment.";
export const INVALID_QUANTITY_UNIT_ERROR = (unitList: string) =>
   `Unité de quantité invalide. Veuillez choisir une unité parmi celles-ci : ${unitList}.`;
export const NEGATIVE_QUANTITY_ERROR = "La quantité ne peut pas être négative. Veuillez entrer une valeur supérieure à zéro.";
export const MINIMUM_NUTRIENTS_ERROR = "Veuillez fournir au moins 5 nutriments incluant les 3 macronutriments, l'énergie et les fibres.";
export const DUPLICATE_NUTRIENTS_ERROR = "Veuillez entrer des nutriments uniques pour l'aliment.";
export const FOOD_UPDATE_RESTRICTED_ERROR = "Cet aliment ne peut pas être modifié.";
export const INVALID_FOOD_REFERENCE_ERROR = "Cet aliment n'existe pas dans le systeme. Veillez modifier la reference de l'aliment de l'ingrédient";
export const EMPTY_FOOD_REFERENCE_ERROR = "La reference a un aliment ne doit pas être vide.";
export const EMPTY_PREPARATION_STEP_DESCRIPTION_ERROR = "La description de l'etape de preparation ne doit pas etre vide.";
export const INVALID_STEP_NUMBER = "Le numéro d'etape ne doit etre >= 0.";

export const INVALID_INGREDIENT_LIST = "La recette doit contenir au moins un ingrédient.";
export const INVALID_PREPARATION_LIST = "La recette doit avoir au moins une étape de préparation.";
export const INVALID_COOKING_TIME = "Le temps de cuisson doit être supérieur à zéro.";
// Autres messages utiles
export const UNIQUE_NUTRIENTS_NOTE = "Assurez-vous d'entrer des nutriments uniques pour l'aliment.";
export const FOOD_ORIGIN_ME_NOTE = "L'aliment du système ne peut être modifié que par l'utilisateur lui-même.";
