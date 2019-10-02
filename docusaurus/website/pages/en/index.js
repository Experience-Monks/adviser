/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/full-logo-dark-bg.png`} />
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href="/adviser/docs/installation">Get Started</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container padding={['bottom', 'top']} {...props}>
        <GridBlock align="left" contents={props.children} layout={props.layout} />
      </Container>
    );

    const Features = () => (
      <Block layout="fourColumn" className="features">
        {[
          {
            content:
              'Plugin/Rule based library with a clear API for development. It includes a basic set of rules by default.',
            image: `${baseUrl}img/undraw_building_blocks_n0nc.svg`,
            imageAlign: 'top',
            title: 'Modular'
          },
          {
            content: `It uses well known linter fashion config files structure, where plugins can be added, rules can be configured and general options set up.`,
            image: `${baseUrl}img/undraw_options_2fvi.svg`,
            imageAlign: 'top',
            title: 'Easy to configure'
          },
          {
            content: `Inspired by ESLint, it integrates perfectly with your local and remote pipelines. It's error friendly and verbose about the suggestions.`,
            image: `${baseUrl}img/undraw_version_control_9bpv.svg`,
            imageAlign: 'top',
            title: 'Integration'
          }
        ]}
      </Block>
    );

    const Use = () => (
      <Block background="light" className="landingSteps">
        {[
          {
            content: `Adviser **behaves like the linters the community is used** to avoid the learning curve. The arguments are really similar ESLint, Stylelint and other famous linters.

To run adviser you just need to run this command:

\`\`\`sh
$ adviser
\`\`\``,
            image: `${baseUrl}img/cli.gif`,
            imageAlign: 'right',
            title: 'Easy to use'
          }
        ]}
      </Block>
    );

    const Installation = () => (
      <Block background="dark" className="landingSteps">
        {[
          {
            content: `Adviser was created using Node.js and can be **installed using npm**.

There is just one base package with default rules. To install it run this command:

\`\`\`sh
$ npm install adviser
\`\`\``,
            image: `${baseUrl}img/install.gif`,
            imageAlign: 'left',
            title: 'Easy to install'
          }
        ]}
      </Block>
    );

    const Setup = () => (
      <Block className="landingSteps">
        {[
          {
            content: `Adviser uses **automatically loads configuration** files with names ".adviserrc", ".adviserrc.json", ".adviserrc.yml", and others.

The configuration file follows general linter conventions where you can load plugins and specify which rules would you like to run. For every rule you specify a severity and its options if is supported.

Check out a configuration file example in the **[adviser repository](https://github.com/Jam3/adviser/blob/master/__tests__/integration/.adviserrc)**.`,
            image: `${baseUrl}img/configuration-file.png`,
            imageAlign: 'right',
            title: 'Easy to setup'
          }
        ]}
      </Block>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <Use />
          <Installation />
          <Setup />
        </div>
      </div>
    );
  }
}

module.exports = Index;
