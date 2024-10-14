const REGULAR = "原味";

class App {
    // List module
    ingredient = []
    single = []
    set_list(ingredient_src, single_src) {
        const convert_to_array = (input) => input.split("\n").filter(x => x !== "");
        this.ingredient = [...convert_to_array(ingredient_src)];
        this.single = [...convert_to_array(single_src)];
    }

    // Flavour module
    blend_flavour = false
    choosen_ingredients = []
    limit_ingredients = 1
    get choosen_flavour() {
        const suffix = "蛋餅";
        let result = "";
        this.choosen_ingredients.forEach( (ingredient_index) => {
            if( ingredient_index === REGULAR ) {
                result += REGULAR;
                return;
            }
            result += this.ingredient[ingredient_index];
        });
        return result + suffix;
    }
    get_ingredients(input = 0, limit_ingredients = 1) {
        let result = [];
        for (let index = 0; index < limit_ingredients; index++) {
            if (index > 100) {
                throw new Error("Loop incorrect!");
            }
            result.push(parseInt(Math.random() * this.ingredient.length, 10));
        }
        result = result.filter( (value, index, array) => array.indexOf(value) === index );
        const ingredients_fits = result.length === this.limit_ingredients;
        if ( ingredients_fits ) {
            return result;
        } else if (input > this.ingredient.length) {
            console.log(`¯\_(ツ)_/¯`);
            return [REGULAR];
        } else {
            return this.get_ingredients(input + 1);
        }
    }
    decide_flavour() {
        this.choosen_ingredients = this.get_ingredients(0, this.limit_ingredients);
        this.show_flavour();
    }
    show_flavour() {
        document.querySelector(".result #result-text").textContent = this.choosen_flavour;
        document.querySelector(".result").removeAttribute("aria-hidden");
        document.querySelector(".result").removeAttribute("hidden");
    }
    reset_flavour(blend_flavour_element) {
        this.blend_flavour = Boolean(blend_flavour_element.checked);
        this.limit_ingredients = this.blend_flavour ? 2 : 1;
        this.choosen_ingredients = [];
        document.querySelector(".result").setAttribute("aria-hidden", true);
        document.querySelector(".result").setAttribute("hidden", true);
    }
    form_action() {
        document.querySelector("#random-form").addEventListener("submit", (e) => {
            const blend_flavour_element = e.target.querySelector("input[name='blend-flavour']");
            e.preventDefault();
            this.reset_flavour(blend_flavour_element);
            this.decide_flavour();
        });
    }

    // Action
    main() {
        // Request list
        Promise.all([
            fetch("./api/ingredient.txt").then( r => r.text() ),
            fetch("./api/single.txt").then( r => r.text() ),
        ]).then( ([ingredient_src, single_src]) => {
            this.set_list(ingredient_src, single_src);
            this.form_action();
        });
    }
}

(new App()).main();

