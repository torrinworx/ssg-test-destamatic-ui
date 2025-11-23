import { Stage, StageContext, Button } from 'destamatic-ui';

import About from './pages/about';
import Blogs from './pages/blogs';
import Landing from './pages/landing';


const stageConfig = {
    stages: {
        Landing: Landing,
        About: About,
        Blogs: Blogs,
    },
    template: ({ children }) => children,
    initial: 'About',
    ssg: true,
    route: '/pages'
};

const Pages = StageContext.use(s => () => {

    return <>
        <div theme='row'>
            <Button
                type="contained"
                label="Landing"
                onClick={() => {
                    console.log("LANDING")
                    window.location.href = 'Landing.html'
                }}
                href='Landing.html'
                style={{ marginRight: 8 }}
            />
            <Button
                type="contained"
                label="Blogs"
                onClick={() => {
                    console.log("BLOGS")
                    window.location.href = 'Blogs.html'
                }}
                href='Blogs.html'
                style={{ marginRight: 8 }}
            />
            <Button
                type="contained"
                label="About"
                onClick={() => {
                    console.log("ABOUT")
                    window.location.href = 'About.html'
                }}
                href='About.html'
                style={{ marginRight: 8 }}
            />
        </div>
        <Stage />
    </>;
});

const App = () => <StageContext value={stageConfig}>
    <Pages />
</StageContext>;

export default App;
