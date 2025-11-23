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
    route: '/'
};

const Pages = StageContext.use(s => () => {

    return <>
        <div theme='row'>
            <Button
                type="contained"
                label="Landing"
                onClick={() => {
                    s.open({ name: 'Landing' })
                }}
                href='Landing.html'
                style={{ marginRight: 8 }}
            />
            <Button
                type="contained"
                label="Blogs"
                onClick={() => {
                    s.open({ name: 'Blogs' })
                }}
                href='Blogs.html'
                style={{ marginRight: 8 }}
            />
            <Button
                type="contained"
                label="About"
                onClick={() => {
                    s.open({ name: 'About' })
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
