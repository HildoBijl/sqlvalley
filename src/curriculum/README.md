# Curriculum - Configuration and tools

This folder contains the module tree, curriculum configuration, and tools that apply them. Dynamically loaded module content lives in `src/modules`.

The content loader supplies lazy components matching learning's `ModuleContent` contract. Pages select the module and pass its content to `ModuleContentView`; learning does not import the curriculum registry. Static practice has a separate component contract.

This part of the ReadMe is still under development. Check back later.
