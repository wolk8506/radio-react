// webpack config overrides for Create React App (via react-app-rewired).
// Silences the Dart Sass "legacy JS API" deprecation warning by passing the
// silenceDeprecations option into the sass-loader (CRA 5 pins sass-loader@12,
// which only uses the legacy API). No behaviour change — only the warning is muted.
module.exports = function override(config) {
  const oneOfRule = config.module.rules.find(
    (rule) => rule && Array.isArray(rule.oneOf)
  );
  if (!oneOfRule) return config;

  oneOfRule.oneOf.forEach((rule) => {
    const use = rule.use;
    if (!use) return;
    const loaders = Array.isArray(use) ? use : [use];
    loaders.forEach((loader) => {
      if (!loader || typeof loader !== 'object') return;
      if (loader.loader && loader.loader.includes('sass-loader')) {
        loader.options = {
          ...loader.options,
          sassOptions: {
            ...(loader.options && loader.options.sassOptions),
            silenceDeprecations: ['legacy-js-api'],
          },
        };
      }
    });
  });

  return config;
};
