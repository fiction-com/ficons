#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

var _standalone = require('./standalone');

var _standalone2 = _interopRequireDefault(_standalone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)('\n    Usage: webfont [input] [options]\n\n    Input: File(s) or glob(s).\n\n        If an input argument is wrapped in quotation marks, it will be passed to node-glob\n        for cross-platform glob support.\n\n    Options:\n\n        --config\n\n            Path to a specific configuration file (JSON, YAML, or CommonJS)\n            or the name of a module in `node_modules` that points to one.\n            If no `--config` argument is provided, webfont will search for\n            configuration  files in the following places, in this order:\n               - a `webfont` property in `package.json`\n               - a `.webfontrc` file (with or without filename extension:\n                   `.json`, `.yaml`, and `.js` are available)\n               - a `webfont.config.js` file exporting a JS object\n            The search will begin in the working directory and move up the\n            directory tree until a configuration file is found.\n\n        -f, --font-name\n\n            The font family name you want, default: "webfont".\n\n        -h, --help\n\n            Output usage information.\n\n        -v, --version\n\n            Output the version number.\n\n        -r, --formats\n\n            Only this formats generate.\n\n        -d, --dest \n\n            Destination for generated fonts.\n\n        -t, --template\n\n            Type of styles (\'css\', \'scss\') or path to custom template.\n\n        -s, --dest-styles\n\n            Destination for generated styles. If not passed used `dest` argument.\n\n        -c, --css-template-class-name  \n\n            Class name in css template.\n\n        -p, --css-template-font-path\n\n            Font path in css template.\n\n        -n, --css-template-font-name\n\n            Font name in css template.\n\n        --verbose   \n        \n            Tell me everything!.\n\n    For "svgicons2svgfont":\n\n        --font-id\n\n            The font id you want, default as "--font-name".\n\n        --font-style\n\n            The font style you want.\n\n        --font-weight\n\n            The font weight you want.\n\n        --fixed-width\n\n            Creates a monospace font of the width of the largest input icon.\n\n        --center-horizontally\n\n            Calculate the bounds of a glyph and center it horizontally.\n\n        --normalize\n\n            Normalize icons by scaling them to the height of the highest icon.\n\n        --font-height\n\n            The outputted font height [MAX(icons.height)].\n\n        --round\n\n            Setup the SVG path rounding [10e12].\n\n        --descent\n\n            The font descent [0].\n\n        --ascent\n\n            The font ascent [height - descent].\n\n        --start-unicode\n\n            The start unicode codepoint for unprefixed files [0xEA01].\n\n        --prepend-unicode\n\n            Prefix files with their automatically allocated unicode codepoint.\n\n        --metadata\n\n            Content of the metadata tag.\n', {
    alias: {
        /* eslint-disable id-length */
        c: 'css-template-class-name',
        d: 'dest',
        f: 'font-name',
        h: 'help',
        n: 'css-template-font-name',
        p: 'css-template-font-path',
        r: 'formats',
        s: 'dest-styles',
        t: 'template',
        v: 'version'
        /* eslint-enable id-length */
    },
    boolean: ['css', 'help', 'version', 'verbose', 'fixed-width', 'center-horizontally', 'normalize', 'prepend-unicode'],
    default: {
        config: false,
        verbose: false
    },
    pkg: '../package.json',
    string: ['font-name', 'dest', 'dest-styles', 'template', 'css-template-class-name', 'css-template-font-path', 'css-template-font-name', 'dest-styles', 'font-id', 'font-style', 'font-weight', 'font-height', 'round', 'descent', 'ascent', 'start-unicode']
});

var optionsBase = {};

if (cli.flags.config) {
    // Should check these possibilities:
    //   a. name of a node_module
    //   b. absolute path
    //   c. relative path relative to `process.cwd()`.
    // If none of the above work, we'll try a relative path starting
    // in `process.cwd()`.
    optionsBase.configFile = (0, _resolveFrom2.default)(process.cwd(), cli.flags.config) || _path2.default.join(process.cwd(), cli.flags.config);
}

if (cli.flags.fontName) {
    optionsBase.fontName = cli.flags.fontName;
}

if (cli.flags.formats) {
    optionsBase.formats = cli.flags.formats;
}

if (cli.flags.dest) {
    optionsBase.dest = cli.flags.dest;
}

if (cli.flags.template) {
    optionsBase.template = cli.flags.template;
}

if (cli.flags.cssTemplateClassName) {
    optionsBase.cssTemplateClassName = cli.flags.cssTemplateClassName;
}

if (cli.flags.cssTemplateFontPath) {
    optionsBase.cssTemplateFontPath = cli.flags.cssTemplateFontPath;
}

if (cli.flags.cssTemplateFontName) {
    optionsBase.cssTemplateFontName = cli.flags.cssTemplateFontName;
}

if (cli.flags.destStyles) {
    optionsBase.destStyles = cli.flags.destStyles;
}

if (cli.flags.verbose) {
    optionsBase.verbose = cli.flags.verbose;
}

if (cli.flags.fontId) {
    optionsBase.fontId = cli.flags.fontId;
}

if (cli.flags.fontStyle) {
    optionsBase.fontStyle = cli.flags.fontStyle;
}

if (cli.flags.fontWeight) {
    optionsBase.fontWeight = cli.flags.fontWeight;
}

if (cli.flags.fixedWidth) {
    optionsBase.fixedWidth = cli.flags.fixedWidth;
}

if (cli.flags.centerHorizontally) {
    optionsBase.centerHorizontally = cli.flags.centerHorizontally;
}

if (cli.flags.normalize) {
    optionsBase.normalize = cli.flags.normalize;
}

if (cli.flags.fontHeight) {
    optionsBase.fontHeight = cli.flags.fontHeight;
}

if (cli.flags.round) {
    optionsBase.round = cli.flags.round;
}

if (cli.flags.descent) {
    optionsBase.descent = cli.flags.descent;
}

if (cli.flags.ascent) {
    optionsBase.ascent = cli.flags.ascent;
}

if (cli.flags.startUnicode) {
    optionsBase.startUnicode = cli.flags.startUnicode;
}

if (cli.flags.prependUnicode) {
    optionsBase.prependUnicode = cli.flags.prependUnicode;
}

if (cli.flags.metadata) {
    optionsBase.metadata = cli.flags.metadata;
}

Promise.resolve().then(function () {
    return Object.assign({}, optionsBase, {
        files: cli.input
    });
}).then(function (options) {
    if (options.files.length === 0) {
        cli.showHelp();
    }

    if (!options.dest) {
        throw new Error('Require `--dest` (`-d`) options');
    }

    return (0, _standalone2.default)(options).then(function (result) {
        return Promise.resolve(result);
    }).then(function (result) {
        result.config = Object.assign({}, {
            dest: options.dest,
            destStyles: options.destStyles
        }, result.config);

        return result;
    });
}).then(function (result) {
    var _result$config = result.config,
        fontName = _result$config.fontName,
        dest = _result$config.dest;


    var destStyles = null;

    if (result.styles) {
        destStyles = result.config.destStyles;


        if (!destStyles) {
            destStyles = dest;
        }

        if (result.usedBuildInStylesTemplate) {
            destStyles = _path2.default.join(destStyles, result.config.fontName + '.' + result.config.template);
        } else {
            destStyles = _path2.default.join(destStyles, _path2.default.basename(result.config.template).replace('.njk', ''));
        }
    }

    return new Promise(function (resolve, reject) {
        (0, _mkdirp2.default)(_path2.default.resolve(dest), function (error) {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    }).then(function () {
        if (!result.styles) {
            return null;
        }

        var stylesDirectory = _path2.default.resolve(_path2.default.dirname(destStyles));

        return new Promise(function (resolve, reject) {
            (0, _mkdirp2.default)(stylesDirectory, function (error) {
                if (error) {
                    return reject(error);
                }

                return resolve();
            });
        });
    }).then(function () {
        return Promise.all(Object.keys(result).map(function (type) {
            if (type === 'config' || type === 'usedBuildInStylesTemplate') {
                return null;
            }

            var content = result[type];
            var destFilename = null;

            if (type !== 'styles') {
                destFilename = _path2.default.resolve(_path2.default.join(dest, fontName + '.' + type));
            } else {
                destFilename = _path2.default.resolve(destStyles);
            }

            return new Promise(function (resolve, reject) {
                _fs2.default.writeFile(destFilename, content, function (error) {
                    if (error) {
                        return reject(new Error(error));
                    }

                    return resolve();
                });
            });
        }));
    }).then(function () {
        return Promise.resolve(result);
    });
}).catch(function (error) {
    console.log(error.stack); // eslint-disable-line no-console

    var exitCode = typeof error.code === 'number' ? error.code : 1;

    process.exit(exitCode); // eslint-disable-line no-process-exit
});