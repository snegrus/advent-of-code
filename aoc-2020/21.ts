import { getContent, getSetIntersection } from "./utils";

const content = getContent();
const relationsiphs: Map<string, Set<string>> = new Map();
const frequency: Map<string, number> = new Map();
const ingredientsWithAllergens = new Map<string, string>();
content.forEach((line) => {
    const [_everything, ingredientsPart, allergenPart] = line.match(
        /([a-z ]+) \(contains ([a-z, ]+)\)/
    );
    const ingredients = new Set(ingredientsPart.split(" "));
    [...ingredients].forEach((ingredient) => {
        const currentCount = frequency.get(ingredient) ?? 0;
        frequency.set(ingredient, currentCount + 1);
    });
    const allergens = allergenPart.split(", ");
    allergens.forEach((allergen) => {
        const candidates = relationsiphs.get(allergen);
        if (candidates == null) {
            relationsiphs.set(allergen, ingredients);
        } else {
            const intersection = getSetIntersection(candidates, ingredients);
            relationsiphs.set(allergen, intersection);
        }
    });
});

// console.log(relationsiphs);

while (relationsiphs.size > 0) {
    const key = [...relationsiphs.keys()].find(
        (key) => relationsiphs.get(key).size === 1
    );
    const ingredientWithAllergen = [...relationsiphs.get(key).keys()][0];
    ingredientsWithAllergens.set(ingredientWithAllergen, key);
    relationsiphs.delete(key);
    [...relationsiphs.keys()].forEach((key) =>
        relationsiphs.get(key).delete(ingredientWithAllergen)
    );
}
// console.log(ingredientsWithAllergens);

let result = 0;
[...frequency.entries()].forEach(([key, value]) => {
    if (!ingredientsWithAllergens.has(key)) {
        result += value;
    }
});
// Part I
console.log(result);
// Part II
console.log(
    [...ingredientsWithAllergens.entries()]
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([a, b]) => a)
        .join(",")
);
