# Webové stránky Debatního spolku Debatního deníku

## Editoři

Webový obsah je z většiny generován pomocí Gatsby.JS. 

### Markdown soubory

Pokud jsi editor, tak jednotlivé stránky najdeš v se složce ./src/content/. Jednotlivé stránky jsou reprezentovány jako Markdown soubory *.md. Pokud s tímto formátem neumíš pracovat využil online návod jako [Markdown Guide](https://www.markdownguide.org/basic-syntax/), primitivní editor s vizualizací jako [Markdown Live Preview](https://markdownlivepreview.com/) nebo WYSIWYG editor jako [Online Markdown Editor](https://onlinemarkdowneditor.dev/).

Každý *.md soubor by měl začínat frontmatterem. Frontmatter je ohraničen `---`. Frontamtter je napsaný ve formátu [YAML](https://www.cloudbees.com/blog/yaml-tutorial-everything-you-need-get-started), zbytek souboru je v Markdown formátu. Pokud si nejsi jistý, zda je tvůj YAML zápis validní, použij [online linter](https://www.yamllint.com/).
```
---
title: O nás #optional
path: /about-us
template: generic
---
```
Do frontmatteru se píší nadstandartní informace. Každý *.md soubor musí alespoň obsahovat `path` která určuje jeho URL cestu (to co vidíš za doménou ve webovém prohlížeči). URL cesty musí být unikátní. Každá cesta začína znakem `/` a tímto znakem je možné cestu více segmentovat pro vizální estetiku, tedy `/clubs-pilsen` lze napsat i jako `/clubs/pilsen`. Z tvého pohledu jako editora v tom není rozdíl. Dále musí obsahovat `template`, která označuje použitou šablonu. Ve většině případů budeš používat šablonu `generic`, která označuje běžnou stránku.

### Obrázky

Pokud potřebuješ přidat vlastní obrázek, proto aby si jej v *.md souboru použil, přidej ho též do složky ./src/content. Cesta k tvému obrázku je relativní vůči *.md souboru v kterém jej používáš.

### Navigace

Pokud chceš aby se tvoje stránka objevila v menu, přidej mí do ./src/content/nav.yml. Stejně jako frontmatter, tak i navigace je psána v [YAML](https://www.cloudbees.com/blog/yaml-tutorial-everything-you-need-get-started). Pro strukturu souboru se inspiruj již existujícím obsahem souboru.

### Pomoc od ChatGPT

Pokud máš k dispozici ChatGPT (nebo jiný nástroj), můžeš jí zkopírovat tuto sekci a nechat si s výrobou souborů poradit.



1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the minimal TypeScript starter.

    ```shell
    # create a new Gatsby site using the minimal TypeScript starter
    npm init gatsby -- -ts
    ```

2.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-gatsby-site/
    npm run develop
    ```

3.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!

    Edit `src/pages/index.tsx` to see your site update in real-time!

4.  **Learn more**

    - [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Tutorials](https://www.gatsbyjs.com/docs/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Guides](https://www.gatsbyjs.com/docs/how-to/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)


## Programátoři

Webové stránky jsou postaveny na [Gatsby.JS](https://www.gatsbyjs.com/docs/), který využívá React.

### Zapojení AI

Codebase obsahuje instrukční soubor pro GitHub Copilot a Claude Code.

Pokud upravuješ CLAUDE.md nebo ./.github/copilot-instructions.md nezapomeň provést relevantní změny v souboru pro druhou AI.


![](./meme.webp)