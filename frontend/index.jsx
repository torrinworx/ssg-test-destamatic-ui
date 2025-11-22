import { mount } from 'destam-dom';
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
};

const Pages = StageContext.use(s => () => {
	s.open({ name: 'Landing', label: 'Landing Page' });

	return <>
		<div theme='row'>
			<Button
				type="contained"
				label="Landing"
				onClick={() => s.open({ name: 'Landing' })}
				style={{ marginRight: 8 }}
			/>
			<Button
				type="contained"
				label="Blogs"
				onClick={() => s.open({ name: 'Blogs' })}
				style={{ marginRight: 8 }}
			/>
			<Button
				type="contained"
				label="About"
				onClick={() => s.open({ name: 'About' })}
				style={{ marginRight: 8 }}
			/>
		</div>
		<Stage />
	</>;
});

const App = () => <StageContext value={stageConfig}>
	<Pages />
</StageContext>;
mount(document.body, <App />);
