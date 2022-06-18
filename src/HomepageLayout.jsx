/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import React, { useState}  from 'react'
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Menu,
  Dropdown,
  Message,
} from 'semantic-ui-react'

import MainEditor from './MainEditor';
import VM, { standard_output } from './kinh_ngu/3vm';


const options = [
    { key: 'Chào bạn', text: 'Chào bạn', value: 'chao ban' },
    { key: 'Khai báo',  text: 'Khai báo', value: 'Khai bao' },
    { key: 'Câu lệnh: nếu', text: 'Câu lệnh: nếu', value: 'cau len neu' },
  ]

const vm = new VM();

const HomepageLayout = () => {

    const [ source, setSource ] = useState("");
    const [ output, setOutput] = useState("");

    const onClick = () => {
        vm.interpret(source);

        setOutput( standard_output.join("\n"));
    }

    return (
        <Container>
            <Menu
                fixed={ 'top' }
                color='yellow'
                inverted
                size='large'
            >
            </Menu>
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Grid className="editor_toolbar">
                <Grid.Column floated='left' width={5}>
                    <Header as='h1' color='blue'>
                        Kinh Ngữ Nguyên Mẫu
                    </Header>
                </Grid.Column>

                <Grid.Column floated='right' width={5} >
                    <Button inverted color='green' compact onClick={onClick}>
                        <Icon name='play' /> Chạy 
                    </Button>

                    <Button inverted color='red' compact >
                        <Icon name='stop' />Ngung
                    </Button>

                    <Button.Group inverted >
                        <Button compact >Bài viếc</Button>
                        <Dropdown
                            className='button icon'
                            floating
                            options={options}
                            trigger={<></>}
                            />
                    </Button.Group>
                </Grid.Column>
            </Grid>

            <Divider hidden />
        <MainEditor setSource={setSource}/>
            
    <Message warning attached='bottom' size='massive' className="output_console">
        <Message.Header>{output}</Message.Header>
        </Message>

    </Container>
    )
    }

export default HomepageLayout