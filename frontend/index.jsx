import { mount, Observer } from 'destam-dom';
import { Typography, Theme, Icons, Icon, Button } from 'destamatic-ui';
import FeatherIcons from "destamatic-ui/components/icons/FeatherIcons";

Theme.define({
    custom: {
        extends: 'h1',
        color: 'white',
    }
});

const App = () => {
    const background = Observer.timer(1000).map(t => t % 2 === 0 ? 'blue' : 'red');

    return <div>
        <div theme='center_radius' style={{ background, padding: 10 }}>
            <Typography type='h1_custom' label='Welcome to destamatic!' />
        </div>
        <div theme='center'>
            <Button
                title='Github'
                label={<Typography type='h4' label='Star destamatic on Github!' />}
                type='icon'
                icon={<Icon name='githubFI' size={30} />}
                onClick={() => window.open('https://github.com/torrinworx/destamatic-ui', '_blank')}
            />
        </div>
    </div>;
};

mount(document.body, <Icons value={[{
    linkedinFI: FeatherIcons('linkedin'),
    gitlabFI: FeatherIcons('gitlab'),
    githubFI: FeatherIcons('github'),
},
    FeatherIcons,
]} > <App /></Icons>);