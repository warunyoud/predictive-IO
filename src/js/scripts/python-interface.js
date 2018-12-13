import { PythonShell } from 'python-shell';

const runPythonScript = (pathToScript, args, onRecieved, onFinish, mode='json') => {
  const options = {
    mode: mode,
    args: args,
    pythonPath : '/usr/bin/python',
    pythonOptions: ['-u']
  };


  let pyshell = new PythonShell(pathToScript, options);

  pyshell.on('message', (data) => {
    if (onRecieved) {
      onRecieved(data);
    }
  });

  pyshell.end((err, code, signal) => {
    if (err) throw err;

    if (onFinish)
      onFinish(err, code, signal);
  });
};

export {
  runPythonScript
}
