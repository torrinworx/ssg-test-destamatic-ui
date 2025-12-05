import {
    Stage,
    StageContext,
    Button,
    Head,
    Title,
    Meta,
    Link,
    Script,
} from 'destamatic-ui';

import About from './pages/About';
import Blogs from './pages/Blogs';
import Landing from './pages/Landing';

const stageConfig = {
    acts: {
        Landing,
        About,
        Blogs,
    },
    template: ({ children }) => children,
    initial: 'Landing',
    ssg: true,
};

const Pages = StageContext.use(s => () => {
    const title = s.observer
        .path('current')
        .map(c => (c ? c : 'Unknown'));

    // Example: page-level description that follows the current stage
    const description = s.observer
        .path('current')
        .map(c => (c ? `Current stage: ${c}` : 'No active stage'));

    return <>
        <Title text={title} />

        <Meta
            group="meta:description"
            name="description"
            content={description}
        />

        <div theme="row" style={{ marginBottom: 16 }}>
            <Button
                type="contained"
                label="Landing"
                onClick={() => {
                    s.open({ name: 'Landing' });
                }}
                href="Landing.html"
                style={{ marginRight: 8 }}
            />
            <Button
                type="contained"
                label="Blogs"
                onClick={() => {
                    s.open({ name: 'Blogs' });
                }}
                href="Blogs.html"
                style={{ marginRight: 8 }}
            />
            <Button
                type="contained"
                label="About"
                onClick={() => {
                    s.open({ name: 'About' });
                }}
                href="About.html"
                style={{ marginRight: 8 }}
            />
            <Button
                type='contained'
                label='Blogs/FirstPage'
                onClick={() => {
                    s.open({ name: 'Blogs/FirstPost' });
                }}
            />
        </div>
        <Stage />
    </>;
});

const App = () => <Head>
    <Title>My App</Title>
    <Meta charset="UTF-8" />
    <Meta
        group="meta:viewport"
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <Link
        rel="icon"
        href="/Test.svg"
        sizes="any"
        type="image/svg+xml"
    />
    <Meta
        group="meta:description"
        name="description"
        content="this is from the ./frontend/index.html file"
    />
    <Meta
        group="meta:description:global"
        name="description"
        content="Global description for the whole app"
    />

    <Script type="application/ld+json">
        {`{ "@context": "https://schema.org", "@type": "WebSite" }`}
    </Script>

    <Script type="module" crossorigin src="/index.js"></Script>

    <img src='/Test.png' style={{ height: 500 }} />
    <StageContext value={stageConfig}>
        <Pages />
    </StageContext>
</Head>;

export default App;
