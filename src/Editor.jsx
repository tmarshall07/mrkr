import React from 'react';
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';

class EditorComponent extends React.Component {
  constructor () {
    super();

    this.state = {
      model: `The client is receivong titrated intravenous oxytocin for augmentation of labor via the secondary line on an intravenous pump. The Client is also receiving maintence intravenous fluis of lactated Ringer’s solution at 125 mL/hr via <strong>an intravenous pump</strong>. The <strong>client has a cervical</strong> dilatation of 5 cm and a <strong>cervical effacement</strong> of 100% with a fetal station of 0 in vertex presentation. intact amniotic membranes are noted. CAtegory I tracing of fetal heart rate (FHR) of <strong>150 bpm, with moderate</strong> variability, and 3 accelerations of 15bpm overt the baseline lasting 15 seconds via external ultrasound. the client is esperiencing contractions every 5 min, which are lasting 70 seconds with moderate inensity via tocotransduce. Vital Signs: HR of 88, BP of 115/78, RR of 15, T of 100.4 F (38.0C). Has a continuous epidural infusion of 0.25% bupivacaine with fentanyl running at 10 mL/hr. Pain 0/10 at this time. Client states, “I had Postpartum hemorrhage with my last viginal delivary asnd I required a blood transfusion.” Medical history of Hypothyroidism and asthma`
    };
  }

  handleModelChange = (model) => {
    this.setState({
      model: model
    });
  }

  render () {
    return <FroalaEditor
    tag='textarea'
    config={{
      events: {
        initialized: this.props.onInit,
      }
    }}
    model={this.state.model}
    onModelChange={this.handleModelChange}
  />
  }
}
export default EditorComponent;