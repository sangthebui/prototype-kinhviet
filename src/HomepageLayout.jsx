/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import React, {useEffect, useState} from 'react'
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
import {interpret, standard_output, Parser} from "viet-ngu";
import MainEditor from './MainEditor';
import { introduction, variables, operators, functions,
    controlFlow, loops, arrays, classes
} from './lessons/';


const options = [
    { key: 'Bắt Đầu', text: 'Bắt Đầu', value: 'Bắt Đầu' },
    { key: 'Khai báo',  text: 'Khai báo', value: 'Khai báo' },
    { key: 'Phép Toán',  text: 'Phép Toán', value: 'Phép toán' },
    { key: 'Hàm',  text: 'Hàm', value: 'Hàm' },
    { key: 'Rẻ Nhánh', text: 'Rẻ Nhánh', value: 'Rẻ Nhánh' },
    { key: 'Vòng Lặp', text: 'Vòng Lặp', value: 'Vòng Lặp' },
    { key: 'Mảng', text: 'Mảng', value: 'Mảng' },
    { key: 'Lớp', text: 'Lớp', value: 'Lớp' },
  ]

const HomepageLayout = () => {

    const [ source, setSource ] = useState("");
    const [ output, setOutput] = useState([]);
    const [ lesson, setLesson] = useState("chao ban");
    const parser = new Parser();

    useEffect(() => {
       setSource(introduction);
    }, [introduction]);


    const play = () => {
        //reset standard_output
        standard_output.splice(0, standard_output.length);
        setOutput([...standard_output]);
        interpret(source);
        setOutput([...standard_output]);

    }

    const stop = () => {
        setSource("");
        standard_output.splice(0, standard_output.length);
        setOutput([...standard_output]);
    }

    const format = () => {
        const result = parser
            .setSource(source)
            .generateTokens()
            .transformTokensValue()
            .returnAllTokensAsText();

        setSource(result);
    }

    const selectLesson = (e, {value}) => {
        switch(value){
            case 'Bắt Đầu': {
                setSource(introduction);
                setLesson('Bắt Đầu');
                break;
            }
            case 'Khai báo': {
                setSource(variables);
                setLesson('Khai báo');
                break;
            }
            case 'Phép toán': {
                setSource(operators);
                setLesson('Phép toán');
                break;
            }
            case 'Hàm': {
                setSource(functions);
                setLesson('Hàm');
                break;
            }
            case 'Rẻ Nhánh' : {
                setSource(controlFlow);
                setLesson('Rẻ Nhánh');
                break;
            }
            case 'Vòng Lặp': {
                setSource(loops);
                setLesson('Vòng Lặp');
                break;
            }
            case 'Mảng': {
                setSource(arrays);
                setLesson('Mảng');
                break;
            }
            case 'Lớp': {
                setSource(classes);
                setLesson('Lớp');
                break;
            }
            default:
                break;// unreachable
        }
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
                        Nguyên Mẫu
                    </Header>
                </Grid.Column>

                <Grid.Column floated='right' width={8} >
                    <Button inverted color='green' compact onClick={format}>
                        <Icon name='edit' />định dạng
                    </Button>
                    <Button inverted color='green' compact onClick={play}>
                        <Icon name='play' /> Chạy 
                    </Button>

                    <Button inverted color='red' compact onClick={stop}>
                        <Icon name='stop' />quét trống
                    </Button>

                    <Button.Group inverted >
                        <Button compact >Bài viết: {lesson}</Button>
                        <Dropdown
                            className='button icon'
                            floating
                            options={options}
                            onChange={selectLesson}
                            trigger={<></>}
                            />
                    </Button.Group>
                </Grid.Column>
            </Grid>

            <Divider hidden />
        <MainEditor setSource={setSource} value={source}/>
            
    <Message warning attached='bottom' size='massive' className="output_console">
        <Message.Header>Console Output:</Message.Header>
            <Message.Content>
                {output.map((each) => each)}
            </Message.Content>
        </Message>

    </Container>
    )
    }

export default HomepageLayout