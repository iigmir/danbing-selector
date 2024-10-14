class App {
    // List module
    ingredient = []
    single = []
    set_list(ingredient_src, single_src) {
        const convert_to_array = (input) => input.split("\r\n").filter(x => x !== "");
        this.ingredient = [...convert_to_array(ingredient_src)];
        this.single = [...convert_to_array(single_src)];
    }

    // Flavour module
    blend_flavour = false
    choosen_index = -1
    blend_choosen_index = -1
    // choosen_type = -1
    get choosen_flavour() {
        const suffix = "蛋餅";
        if( this.blend_flavour ) {
            return `${this.ingredient[this.choosen_index]}${this.ingredient[this.blend_choosen_index]}${suffix}`;
        }
        return `${this.ingredient[this.choosen_index]}${suffix}`;
    }
    decide_flavour() {
        this.choosen_index = parseInt(Math.random() * this.ingredient.length, 10);
        this.blend_choosen_index = parseInt(Math.random() * this.ingredient.length, 10);
        const flavours_are_the_same = this.choosen_index === this.blend_choosen_index;
        if( flavours_are_the_same ) {
            this.decide_flavour();
        } else {
            this.show_flavour();
            return;
        }
    }
    show_flavour() {
        document.querySelector(".result #result-text").textContent = this.choosen_flavour;
        document.querySelector(".result").removeAttribute("aria-hidden");
        document.querySelector(".result").removeAttribute("hidden");
    }
    reset_flavour(blend_flavour_element) {
        this.blend_flavour = Boolean(blend_flavour_element.checked);
        this.choosen_index = -1;
        this.blend_choosen_index = -1;
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

