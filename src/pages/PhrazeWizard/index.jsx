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
          phrase: item,
          validate: {
            isValid: true,
            help: '',
            fullValid: false
          }
        }
      });

      return {
        ...state,
        ...result
      }
    }
    case 'change_input': {
      let validate = {
        isValid: true,
        help: '',
        fullValid: false
      };
      
      for (let i = 0; i < value.length; i += 1) {
        if (value[i] === '.') {
          break;
        }
        if (value[i] !== state[field].phrase[i]) {
          validate = {
            ...validate,
            isValid: false,
            help: 'Error'
          }
          break;
        }
      };

      if (value[value.length - 1] !== '.' && value === state[field].phrase) {
        validate = {
          ...validate,
          fullValid: true
        }
      } else {
        validate = {
          ...validate,
          fullValid: false
        }
      }

      return {
        ...state,
        [field]: {
          ...state[field],
          value: value,
          validate: validate
        }
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
};

const PhrazeWizard = () => {
  const [form] = Form.useForm();
  const [ state, dispatch ] = useReducer(reducer, initInputFields);

  useEffect(() => {
    dispatch({ type: 'get_phrases_success', payload: task1 })
  }, []);
  

  const handleInput = (e) => {
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
                    <Form.Item
                      validateStatus={item.validate.isValid ? 'success' : 'error'}
                      help={item.validate.help}
                      hasFeedback={item.validate.fullValid}
                    >
                      <InputMask name={`phrase_${index}`} mask={`${'a'.repeat(item.countSym)}`} value={item.value} onChange={handleInput} maskChar='.'>
                        {(inputProps) => <Input {...inputProps} placeholder={`${'.'.repeat(item.countSym)}`}/>}
                      </InputMask>
                    </Form.Item>
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