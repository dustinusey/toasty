const DEFAULT_OPTIONS = {
    autoClose: 5000,
    position: "top-right",
    canClose: true,
    showProgress: true,
    style: "success",
    darkMode: false,
    onClose: () => {}
}
export default class Toasty {
    #toastElement
    #autoCloseTimeout
    #removeBind
    #autoClose
    #visibleSince

    constructor(options) {
        this.#toastElement = document.createElement('div');
        this.#toastElement.classList.add("toasty");
        setTimeout(() => { this.#toastElement.classList.add('show') }, 200)
        this.#visibleSince = new Date();
        this.#removeBind = this.remove.bind(this);
        Object.entries({ ...DEFAULT_OPTIONS, ...options }).forEach(([key, value]) => { this[key] = value });
        
    }

    set autoClose(value) {
        this.#autoClose = value
        if (value === false) return
        if (this.#autoCloseTimeout != null) clearTimeout(this.#autoCloseTimeout);
        this.#autoCloseTimeout = setTimeout(() => this.remove(), value)
    }

    set position(value) {
        const selector =  `.toasty-container[data-position="${value}"]`
        const container = document.querySelector(selector) || createContainer(value);
        container.append(this.#toastElement);
    }

    set canClose(value) {
        this.#toastElement.classList.toggle("can-close", value);
        if (value) {
            this.#toastElement.addEventListener('click', this.#removeBind)
        } else {
            this.#toastElement.removeEventListener('click', this.#removeBind)
        }
    }

    set text(value) {
        this.#toastElement.textContent = value;
    }

    set showProgress(value) {
        this.#toastElement.classList.toggle('progress', value)
        this.#toastElement.style.setProperty("--progress", 1)
        if (value) {
            setInterval(() => {
                
                const timeVisible = new Date() - this.#visibleSince
                this.#toastElement.style.setProperty("--progress", 1 - timeVisible / this.#autoClose)
            }, 10)
        }
    }

    set style(value) {
        this.#toastElement.classList.add(value)
    }

    set darkMode(value) {
        if (value) {
            this.#toastElement.classList.add('dark')
        }
    }
    

    remove(){
        const container = this.#toastElement.parentElement;
        this.#toastElement.classList.remove('show');
        this.#toastElement.addEventListener('transitionend', () => {
            this.#toastElement.remove();
            if (container.hasChildNodes()) return
            container.remove();
        })
        this.onClose();
        
    }
}

function createContainer(position) {
    const container = document.createElement('div');
    container.classList = 'toasty-container';
    container.dataset.position = position;
    document.body.append(container);
    return container;
}