# Ficons 	
Drop in replacement for Font Awesome from Fiction.com designed by Kreatank 



**Deadline**

End of November



**Specification**

- **Icon Design**
  - Consider that these will be tied to Fiction's brand and styleguide
  - Minimal and Simple Icon Style and Theme 
  - Replace the more commonly used and uglier icons from Font Awesome first, using simpler and lighter designs. 
    - Icons that are common and bad are for example the user icons, birthday, dashboard, bells, bombs
- Organization
  - We will start with a single folder for ALL SVG files for the font from Font Awesome and add the edits with naming conventions
  - Icons that we edit should be titled "edit-[name].svg"
  - Icons that we add (new) should be titled "new-[name].svg"
  - (Applying special names will allow the build to handle them differently)
- Home Page
  - Marketing: 
    - "Drop-In Replacement for Font Awesome. Use the same class names and get new and improved icons. "
    - Sick of the same old font awesome icons but still like the convenience of using it? Well now you can use Ficons a drop-in replacement for FA. Just install  and remove Font Awesome and you're classes will work the same as they did before, but with better icons. 
    - "By Fiction.com designed by Kreatank"
  - Getting Started Guide
- Icons Reference Page
  - A listing of icons we've replaced (with same names)
  - A listings of new icons we've added (e.g. fa-fiction)
- Functional
  - Download files including font files, CSS, LESS (same as FA)
  - Provided CSS + LESS/SCSS
  - Generated CDN link
  - NPM repository (should work sim to FA's)
- Tools & Packages Needed
  - Webpack - Build the site
  - Webpack - Build the download (CSS/Fonts)
  - NPM - Package to Generate font from SVGs
  - Webpack/NPM - Write the LESS > CSS for the icons
  - Font Awesome - Will need to copy the basic CSS for scaling and rotating, etc.. 
  - Github Pages - Will be a direct hosting from the repo
  - CNAME/DNS - https://ficons.fiction.com will be made to forward to the github page
- Other
  - LICENSE - License needs to be same as Font Awesome 