class EqualizerCard extends HTMLElement {
    set hass(hass) {
        if (!this.content) {
            this.innerHTML = "";
            this.content = document.createElement("div");
            this.content.style.display = "flex";
            this.content.style.justifyContent = "center";
            this.content.style.gap = "10px";
            this.content.style.alignItems = "center";
            this.content.style.height = this.config.height || "300px"; // Set card height
            this.appendChild(this.content);
        }

        if (this._isDragging) return; // Prevent re-rendering during slider interaction

        this.content.innerHTML = ""; // Clear content on update
        this.content.style.height = this.config.height || "300px"; // Dynamically update height

        this.config.entities.forEach((entityConfig) => {
            const entity = hass.states[entityConfig.entity];
            if (!entity) return;

            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";

            const valueDisplay = document.createElement("span");
            valueDisplay.innerText = entity.state;
            valueDisplay.style.marginBottom = "5px";

            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = entity.attributes.min || 0;
            slider.max = entity.attributes.max || 100;
            slider.step = entity.attributes.step || 1;
            slider.value = entity.state;

            // Style the slider (affect only the slider track and thumb)
            slider.style.writingMode = "bt-lr"; // Vertical slider
            slider.style.appearance = "slider-vertical";
            slider.style.height = `calc(${this.config.height || "300px"} - 50px)`; // Adjust slider height
            slider.style.width = "10px";

            // Apply custom color to slider track and thumb
            slider.style.setProperty("--slider-color", this.config.color || "#ccc");
            slider.style.background = `
                linear-gradient(to bottom, var(--slider-color), var(--slider-color))
            `;
            slider.style.outline = "none";
            slider.style.border = "1px solid var(--slider-color)";
            slider.style.borderRadius = "5px";

            // Debounce the service call
            let debounceTimer;
            slider.addEventListener("input", (event) => {
                const value = parseFloat(event.target.value); // Ensure value is a number
                valueDisplay.innerText = value;
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    hass.callService("input_number", "set_value", {
                        entity_id: entityConfig.entity,
                        value: value, // Pass the numeric value here
                    });
                }, 300);
            });

            // Track dragging state to prevent re-renders
            slider.addEventListener("mousedown", () => {
                this._isDragging = true;
            });

            slider.addEventListener("mouseup", () => {
                this._isDragging = false;
            });

            const label = document.createElement("span");
            label.innerText = entityConfig.name;
            label.style.marginTop = "5px";

            container.appendChild(valueDisplay);
            container.appendChild(slider);
            container.appendChild(label);

            this.content.appendChild(container);
        });
    }

    setConfig(config) {
        if (!config.entities) {
            throw new Error("You need to define entities");
        }
        this.config = config;

        // Apply initial height to the card
        if (config.height) {
            this.style.height = config.height;
        }
    }

    getCardSize() {
        return 2;
    }
}

customElements.define("equalizer-card", EqualizerCard);
