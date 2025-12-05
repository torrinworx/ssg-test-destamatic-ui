import { Stage, StageContext, Button, Title } from 'destamatic-ui';


const BlogHome = () => {
    return <div>
        <h2>Blog Home</h2>
        <p>Welcome to the blog section. Choose a post using the buttons above.</p>
    </div>;
};

const FirstPost = () => {
    return <div>
        <h2>First Post</h2>
        <p>This is the first example blog post. You can put any content here.</p>
    </div>;
};

const SecondPost = () => {
    return <div>
        <h2>Second Post</h2>
        <p>This is the second example blog post. Yet another nested stage example.</p>
    </div>;
};

const blogsStageConfig = {
    acts: {
        Blogs: BlogHome,
        FirstPost,
        SecondPost,
    },
    template: ({ children }) => children,
    initial: 'Blogs',
    ssg: true,
};

const BlogPages = StageContext.use(s => () => {

    const title = s.observer.path('current').map(c => c ? `blogs | ${c}` : 'blogs');

    return <>
        <Title text={title} />
        <div theme="row" style={{ marginBottom: 16 }}>
            <Button
                type="contained"
                label="Blog Home"
                onClick={() => {
                    s.open({ name: 'Blogs' });
                }}
                href="/blogs/"
                style={{ marginRight: 8 }}
            />
            <Button
                type="contained"
                label="First Post"
                onClick={() => {
                    s.open({ name: 'FirstPost' });
                }}
                href="FirstPost.html"
                style={{ marginRight: 8 }}
            />
            <Button
                type="contained"
                label="Second Post"
                onClick={() => {
                    s.open({ name: 'SecondPost' });
                }}
                href="SecondPost.html"
                style={{ marginRight: 8 }}
            />
        </div>
        <Stage />
    </>;
});

const Blogs = () => {
    return <StageContext value={blogsStageConfig}>
        <BlogPages />
    </StageContext>;
};

export default Blogs;
