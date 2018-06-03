import * as React from 'react'
import { Palette } from '../../style/palette'

interface NumericInputFieldProps {
  isDisabled?: Boolean
  value: number
  onSubmit(value: number): void
}

interface NumericInputFieldState {
  isEditing: Boolean
  editedValue: string
  editedValueIsValid: Boolean
}

export default class NumericInputField extends React.Component<NumericInputFieldProps, NumericInputFieldState> {

  constructor(props: NumericInputFieldProps) {
    super(props)
    this.state = {
      isEditing: false,
      editedValue: props.value.toString(),
      editedValueIsValid: true
    }
  }

  handleChange(event: any) {
    this.setState({
      ...this.state,
      editedValue: event.target.value,
      editedValueIsValid: this.numericValue(event.target.value) != undefined
    })
  }

  handleSubmit(event: any) {
    event.preventDefault()
    this.finishEditing()
    event.target.blur()
  }

  handleFocus(_: any) {
    this.beginEditing()
  }

  handleBlur(_: any) {
    this.cancelEditing()
  }

  render() {
    let inputStyle: any = {
      border: 'none',
      outline: 'none',
      width: '60px'
    }

    if (this.props.isDisabled) {
      inputStyle = {
        ...inputStyle,
        backgroundColor: Palette.lightGray
      }
    }

    if (this.state.isEditing) {
      if (this.state.editedValueIsValid) {
        inputStyle = {
          ...inputStyle,
          border: '1px solid ' + Palette.green
        }
      } else {
        inputStyle = {
          ...inputStyle,
          border: '1px solid ' + Palette.red
        }
      }
    }

    return (
      <input
        style={inputStyle}
        type='text'
        value={this.state.isEditing ? this.state.editedValue : this.props.value}
        onChange={(event: any) => {
          if (!this.props.isDisabled) {
            this.handleChange(event)
          }
        }}
        onFocus={(event: any) => {
          if (!this.props.isDisabled) {
            this.handleFocus(event)
          }
        }}
        onBlur={(event: any) => {
          if (!this.props.isDisabled) {
            this.handleBlur(event)
          }
        }}
        onKeyDown={(event: any) => {
          if (!this.props.isDisabled) {
            if (event.key == 'Escape') {
              this.cancelEditing()
              event.target.blur()
            } else if (event.key == 'Enter') {
              if (this.state.editedValueIsValid) {
                this.handleSubmit(event)
              }
            }
          }
        }}
      />
    )
  }

  private beginEditing() {
    this.setState({
      ...this.state,
      isEditing: true,
      editedValue: this.props.value.toString(),
      editedValueIsValid: true
    })
  }

  private finishEditing() {
    this.setState({
      ...this.state,
      isEditing: false
    })
    let numericValue = this.numericValue(this.state.editedValue)
    this.props.onSubmit(numericValue == undefined ? 0 : numericValue)
  }

  private cancelEditing() {
    this.setState({
      ...this.state,
      isEditing: false
    })
  }

  private numericValue(stringValue: string): number | undefined {
    let value = parseFloat(stringValue)
    return isNaN(value) ? undefined : value
  }
}