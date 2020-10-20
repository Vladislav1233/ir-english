import React, { useReducer, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Row, 
  Col
} from 'antd';
import './style.scss';
import InputMask from 'react-input-mask';


// На сервере будут хранится таски, для каждой страницы свой таск, по порядку. И ты должен вытаскивать этот таск в соответствии со страницей.
const task1 = {
  urlVideo: '',
  phrases: [
    'you',
    'are',
    'beautiful',
    'girl'
  ]
};

const initInputFields = {};

function reducer(state = initInputFields, { field, value, payload, type }) {
  switch (type) {
    case 'get_phrases_success': {
      const result = {};

      payload.phrases.forEach((item, index) => {
        result[`phrase_${index}`] = {
          value: '',
          countSym: item.length,
          phrase: item
        }
      });

      return {
        ...state,
        ...result
      }
    }
    case 'change_input': {
      return {
        ...state,
        [field]: {
          ...state[field],
          value: value
        }
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

const PhrazeWizard = () => {
  const [form] = Form.useForm();
  const [ state, dispatch ] = useReducer(reducer, initInputFields);

  useEffect(() => {
    dispatch({ type: 'get_phrases_success', payload: task1 })
  }, []);
  

  const handleInput = (e) => {
    console.log(e.target.name)
    dispatch({ field: e.target.name, value: e.target.value, type: 'change_input' });
  };

  const dataPhrases = Object.values(state);

  return <div className="PhrazeWizard">
    <div className="PhrazeWizard__content">
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <div className="PhrazeWizard__video">
            Video
          </div>
        </Col>

        {!!dataPhrases.length && <Col span={24}>
          <div className="PhrazeWizard__form">
            <Form
              form={form}
              size="large"
            >
              <Row gutter={8} justify='center'>
                {dataPhrases.map((item, index) => {
                  return <Col span={item.countSym < 6 ? 2 : Math.floor(item.countSym / 3)} key={index}>
                    <InputMask name={`phrase_${index}`} mask={`${'a'.repeat(item.countSym)}`} value={item.value} onChange={handleInput} maskChar='.'>
                      {(inputProps) => <Input {...inputProps} placeholder={`${'.'.repeat(item.countSym)}`}/>}
                    </InputMask>
                  </Col>
                })}
              </Row>
            </Form>
          </div>
        </Col>}
      </Row>
    </div>
  </div>
}

export default PhrazeWizard;