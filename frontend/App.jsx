import {
    Stage,
    StageContext,
    Button,
    Head,
    Title,
    Meta,
    Link,
    Script,
    Style,
} from 'destamatic-ui';

import About from './pages/about';
import Blogs from './pages/blogs';
import Landing from './pages/landing';

const stageConfig = {
    stages: {
        Landing,
        About,
        Blogs,
    },
    template: ({ children }) => children,
    initial: 'About',
    ssg: true,
    route: '/',
};

const Pages = StageContext.use(s => () => {
    const title = s.observer
        .path('current')
        .map(c => (c ? c : 'Unknown'));

    // Example: page-level description that follows the current stage
    const description = s.observer
        .path('current')
        .map(c => (c ? `Current stage: ${c}` : 'No active stage'));

    return (
        <>
            {/* Dynamic title for the root Stage */}
            <Title text={title} />

            {/* Dynamic description for the root Stage */}
            <Meta
                group="meta:description"          // unique per group
                name="description"
                content={description}
            />

            {/* Some global resources */}
            <Link rel="stylesheet" href="/css/global.css" />
            <Script src="/js/global.js" defer />
            <Style>
                {`.root { font-family: system-ui; }`}
            </Style>

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
            </div>

            <Stage />
        </>
    );
});

const App = () => (
    <Head>
        <Title>My App</Title>
        <Meta
            group="meta:description:global"
            name="description"
            content="Global description for the whole app"
        />
        <Link rel="icon" href="/favicon.ico" />
        <Script type="application/ld+json">
            {`{ "@context": "https://schema.org", "@type": "WebSite" }`}
        </Script>
        <Style>
            {`body { margin: 0; }`}
        </Style>

        {/* The routed content */}
        <StageContext value={stageConfig}>
            <Pages />
        </StageContext>
    </Head>
);

export default App;