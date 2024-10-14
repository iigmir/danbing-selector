class App {
    // Magic constants
    REGULAR = "原味"
    SUFFIX = "蛋餅"

    // List module
    ingredient = []
    single = []
    set_list(ingredient_src, single_src) {
        const convert_to_array = (input) => input.split("\n").filter(x => x !== "");
        this.ingredient = [...convert_to_array(ingredient_src)];
        this.single = [...convert_to_array(single_src)];
    }

    // Flavour module
    chosen_ingredients = []
    limit_ingredients = 1
    get chosen_flavour() {
        const ingredients = this.chosen_ingredients.map( ingredient_index =>
            ingredient_index === this.REGULAR ? this.REGULAR : this.ingredient[ingredient_index]
        );
        return ingredients.join("") + this.SUFFIX;
    }
    get_ingredients(input = 0, limit_ingredients = 1) {
        let result = [];
        while (result.length < limit_ingredients && input <= 100) {
            let random_index = Math.floor(Math.random() * this.ingredient.length);
            if (!result.includes(random_index)) {
                result.push(random_index);
            }
            input++;
        }

        if (result.length === limit_ingredients) {
            return result;
        }

        if (input > 100) {
            console.log("🤷");
            return [this.REGULAR];
        }
        return this.get_ingredients(input, limit_ingredients);
    }
    decide_flavour() {
        this.chosen_ingredients = this.get_ingredients(0, this.limit_ingredients);
        this.show_flavour();
    }

    // Result rendering module
    result_element = null
    set_hidden_status(result_element, show_dom = false) {
        if( !result_element ) {
            throw new Error("No elements given");
        }
        if( show_dom === true ) {
            this.result_element.removeAttribute("aria-hidden");
            this.result_element.removeAttribute("hidden");
        } else {
            this.result_element.setAttribute("aria-hidden", true);
            this.result_element.setAttribute("hidden", true);
        }
    }
    show_flavour() {
        this.result_element.querySelector("#result-text").textContent = this.chosen_flavour;
        this.set_hidden_status( this.result_element, true );
    }
    reset_flavour(blend_flavour_element) {
        const blend_flavour = blend_flavour_element ? Boolean(blend_flavour_element.checked) : false;
        this.limit_ingredients = blend_flavour ? 2 : 1;
        this.chosen_ingredients = [];
        this.set_hidden_status( this.result_element, false );
    }

    // Action
    handle_submit(e) {
        const blend_flavour_element = e.target.querySelector("input[name='blend-flavour']");
        e.preventDefault();
        this.reset_flavour(blend_flavour_element);
        this.decide_flavour();
    }
    main() {
        this.result_element = document.querySelector(".result");
        if( this.result_element == null ) {
            throw new Error("No element can show our result!");
        }
        // Request list
        Promise.all([
            fetch("./api/ingredient.txt").then( r => r.text() ),
            fetch("./api/single.txt").then( r => r.text() ),
        ]).then( ([ingredient_src, single_src]) => {
            this.set_list(ingredient_src, single_src);
            if( document.querySelector("#random-form") ) {
                document.querySelector("#random-form").addEventListener("submit", this.handle_submit.bind(this) );
            }
        }).catch( e => {
            console.error("Error fetching ingredients:", e);
        });
    }
}

(new App()).main();
